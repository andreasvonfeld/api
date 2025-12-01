const prisma = require('../config/prismaClient');

module.exports = {
  getCart: async (req, res) => {
    const userId = req.user.id;

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true }
    });

    res.json(cart || { items: [] });
  },

  addToCart: async (req, res) => {
  try {
    const userId = req.user.id;
    const { productSizeId, quantity } = req.body;

    const parsedProductSizeId = parseInt(productSizeId);
    const parsedQuantity = parseInt(quantity);

    if (!parsedProductSizeId || !parsedQuantity || parsedQuantity <= 0) {
      return res.status(400).json({
        message: "productSizeId et quantity (> 0) sont obligatoires",
      });
    }

    // 1) Récupérer la variante pour connaître le stock
    const variant = await prisma.productSize.findUnique({
      where: { id: parsedProductSizeId },
    });

    if (!variant) {
      return res.status(404).json({
        message: "Variante (produit + taille) introuvable",
      });
    }

    // 2) Récupérer ou créer le panier
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    // 3) Voir si cette variante est déjà dans le panier
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productSizeId: parsedProductSizeId,
      },
    });

    const currentQtyInCart = existingItem ? existingItem.quantity : 0;
    const totalRequested = currentQtyInCart + parsedQuantity;

    // 4) Vérifier le stock
    if (totalRequested > variant.stock) {
      return res.status(400).json({
        message: "Stock insuffisant pour cette taille.",
        detail: {
          stockDisponible: variant.stock,
          dejaDansPanier: currentQtyInCart,
          demande: parsedQuantity,
        },
      });
    }

    // 5) Mettre à jour ou créer l'item dans le panier
    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: totalRequested },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productSizeId: parsedProductSizeId,
          quantity: parsedQuantity,
        },
      });
    }

    res.json({ message: "Produit ajouté au panier" });
  } catch (err) {
    console.error("addToCart error:", err);
    res.status(500).json({ message: "Erreur lors de l'ajout au panier" });
  }
},


  removeFromCart: async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItemId = parseInt(req.params.cartItemId);

    if (isNaN(cartItemId)) {
      return res.status(400).json({ message: "cartItemId invalide" });
    }

    // Vérifie que le panier existe
    const cart = await prisma.cart.findUnique({
      where: { userId }
    });

    if (!cart) {
      return res.status(400).json({ error: "Panier introuvable" });
    }

    // On supprime UNIQUEMENT cette ligne du panier
    const deleted = await prisma.cartItem.deleteMany({
      where: {
        id: cartItemId,   // 👈 on supprime l'item
        cartId: cart.id,  // 👈 mais uniquement si il appartient à ce panier
      }
    });

    if (deleted.count === 0) {
      return res.status(404).json({
        error: "Cet article n'existe pas dans le panier"
      });
    }

    res.json({ message: "Produit retiré du panier" });

  } catch (err) {
    console.error("removeFromCart error:", err);
    res.status(500).json({ message: "Erreur lors de la suppression" });
  }
},

  clearCart: async (req, res) => {
    const userId = req.user.id;

    const cart = await prisma.cart.findUnique({
      where: { userId }
    });

    if (!cart) return res.status(400).json({ error: "Panier introuvable" });

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    res.json({ message: "Panier vidé" });
  },

    updateCartItem: async (req, res) => {
    const userId = req.user.id;
    const { productSizeId } = req.params;
    const { quantity } = req.body;
    const parsedQuantity = parseInt(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity < 0) {
        return res.status(400).json({ message: "Quantité invalide" });
    }
    const cart = await prisma.cart.findUnique({
        where: { userId }
    });
    if (!cart) return res.status(400).json({ error: "Panier introuvable" });

    const cartItem = await prisma.cartItem.findFirst({
        where: { cartId: cart.id, productSizeId: parseInt(productSizeId) }
    });
    if (!cartItem) return res.status(404).json({ error: "Article du panier introuvable" });
    if (parsedQuantity === 0) {
        await prisma.cartItem.delete({
            where: { id: cartItem.id }
        });
        return res.json({ message: "Article retiré du panier" });
    }
    await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: parsedQuantity }
    });
    res.json({ message: "Quantité mise à jour" });
    }




};
