const prisma = require('../config/prismaClient.js'); 

// --- CREATE (POST /api/products) ---
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, categoryId, variants } = req.body;

    if (!name || price === undefined || !categoryId) {
      return res.status(400).json({
        message: 'Les champs name, price et categoryId sont obligatoires.',
      });
    }

    // Préparation des données de base du produit
    const productData = {
      name,
      description: description ?? null,
      price: parseFloat(price),
      categoryId: parseInt(categoryId),
    };

    // Si on a des variantes (tailles + stock), on les ajoute
    if (Array.isArray(variants) && variants.length > 0) {
      productData.variants = {
        create: variants.map(v => ({
          sizeId: parseInt(v.sizeId),
          stock: parseInt(v.stock ?? 0),
        })),
      };
    }

    const product = await prisma.product.create({
      data: productData,
      include: {
        category: { select: { type: true } },
        variants: {
          include: { size: true },
        },
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('createProduct error:', error);
    res.status(400).json({
      message: 'Erreur lors de la création du produit.',
      error: error.message,
    });
  }
};

// --- READ ALL (GET /api/products) ---
exports.getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: { type: true },
        },
        variants: {
          include: {
            size: true,
          },
        },
      },
    });

    res.status(200).json(products);
  } catch (error) {
    console.error('getProducts error:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des produits.',
      detail: error.message,
    });
  }
};

// --- READ ONE (GET /api/products/:id) ---
exports.getProductById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: { type: true },
        },
        variants: {
          include: {
            size: true,
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé.' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('getProductById error:', error);
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

// --- UPDATE (PUT /api/products/:id) ---
exports.updateProduct = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const { name, description, price, categoryId, variants } = req.body;

    // Préparer les données simples
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (categoryId !== undefined) updateData.categoryId = parseInt(categoryId);

    // Si pas de variantes dans le body, on ne touche pas aux tailles
    if (!Array.isArray(variants)) {
      const product = await prisma.product.update({
        where: { id },
        data: updateData,
        include: {
          category: { select: { type: true } },
          variants: {
            include: { size: true },
          },
        },
      });

      return res.status(200).json(product);
    }

    // Sinon : on met à jour le produit + on remplace *toutes* les variantes
    const result = await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id },
        data: updateData,
      });

      // Supprimer les anciennes variantes
      await tx.productSize.deleteMany({
        where: { productId: id },
      });

      // Recréer les nouvelles
      if (variants.length > 0) {
        await tx.productSize.createMany({
          data: variants.map(v => ({
            productId: id,
            sizeId: parseInt(v.sizeId),
            stock: parseInt(v.stock ?? 0),
          })),
        });
      }

      // Retourner le produit complet
      return tx.product.findUnique({
        where: { id },
        include: {
          category: { select: { type: true } },
          variants: {
            include: { size: true },
          },
        },
      });
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('updateProduct error:', error);
    res.status(400).json({
      message: 'Erreur lors de la mise à jour du produit.',
      error: error.message,
    });
  }
};

// --- DELETE (DELETE /api/products/:id) ---
exports.deleteProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.$transaction([
      prisma.productSize.deleteMany({
        where: { productId: id },
      }),
      prisma.product.delete({
        where: { id },
      }),
    ]);

    res.status(204).send();
  } catch (error) {
    console.error('deleteProduct error:', error);
    res.status(404).json({
      message: 'Produit non trouvé ou erreur de suppression.',
      error: error.message,
    });
  }
};
