const prisma = require('../config/prismaClient.js'); 

// --- CREATE (POST /api/products) ---
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, countInStock } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        countInStock: parseInt(countInStock) || 0,
        categoryId
      },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création du produit.', error: error.message });
  }
};

// --- READ ALL (GET /api/products) ---
exports.getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: { type: true }, // récupère juste le libellé
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
    const products = await prisma.product.findMany({
      where: { id },
      include: {
        category: {
          select: { type: true }, // récupère juste le libellé
        },
      },
    });
    if (products) {
      res.status(200).json(products);
    } else {
      res.status(404).json({ message: 'Produit non trouvé.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// --- UPDATE (PUT /api/products/:id) ---
exports.updateProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    // Préparer les données pour la mise à jour
    const updateData = {};
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.price !== undefined) updateData.price = parseFloat(req.body.price);
    if (req.body.countInStock !== undefined) updateData.countInStock = parseInt(req.body.countInStock);
    
    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour du produit.', error: error.message });
  }
};

// --- DELETE (DELETE /api/products/:id) ---
exports.deleteProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.product.delete({
      where: { id },
    });
    res.status(204).send(); // 204 No Content
  } catch (error) {
    res.status(404).json({ message: 'Produit non trouvé ou erreur de suppression.', error: error.message });
  }
};