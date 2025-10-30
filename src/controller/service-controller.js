import serviceService from "../service/service-service.js"

const getAll = async (req, res, next) => {
  try {
    const result = await serviceService.getAllServices()
    res.status(200).json(result)
  } catch (e) {
    next(e)
  }
}

export default { getAll }
