const prisma = require('../config/prismaClient.js'); 

// --- CREATE (POST /api/products) ---
exports.createCategory = async (req, res) => {
  try {
    const { type } = req.body;
    const category = await prisma.category.create({
      data: {
        type,
      },
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création de la catégorie.', error: error.message });
  }
};

// --- READ ALL (GET /api/products) ---
exports.getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();

    res.status(200).json(categories);
  } catch (error) {
    console.error('getCategories erreur :', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des catégories.',
      detail: error.message,
    });
  }
};