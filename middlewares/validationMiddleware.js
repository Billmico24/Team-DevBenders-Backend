const validateProduct = (req, res, next) => {
    const { name, description, nutrition } = req.body;
  
    if (!name || !description || !nutrition) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
  
    // Additional validation logic if needed
  
    next();
  };
  
  export { validateProduct };