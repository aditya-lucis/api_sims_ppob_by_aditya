import bannerService from "../service/banner-service.js"

const getAll = async (req, res, next) => {
  try {
    const result = await bannerService.getAllBanners()
    res.status(200).json(result)
  } catch (e) {
    next(e)
  }
}

export default { getAll }
