const prisma = require('../config/prismaClient.js'); 

//GET /api/users/allUsers
exports.allUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true, createdAt: true }
    });
    res.json({ users });
  } catch (e) {
    res.status(500).json({ message: 'Erreur serveur', detail: e.message });
  } };

//DELETE /api/users/deleteUser/:id
exports.deleteUser = async (req, res) => {
  try {
    const users = await prisma.user.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.status(204).send();
    
  } catch (error) {
    res.status(404).json({ message: 'Produit non trouvé ou erreur de suppression.', error: error.message });
}};