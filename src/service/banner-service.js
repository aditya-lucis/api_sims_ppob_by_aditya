import { query } from "../application/database.js"
import { ResponseError } from "../error/response-error.js"

const getAllBanners = async () => {
  const rows = await query(
    "SELECT banner_name, banner_image, description FROM banners"
  )

  if (rows.length === 0) {
    throw new ResponseError(404, "Banner not found")
  }

  return {
    status: 0,
    message: "Sukses",
    data: rows,
  }
}

export default { getAllBanners }
