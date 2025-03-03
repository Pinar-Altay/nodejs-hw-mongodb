// Adım 2-4

const ctrlWrapper = (controller) => {
  return async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error); // Hata yakalandığında errorHandler'a ilet
    }
  };
};

export default ctrlWrapper;
