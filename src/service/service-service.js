import { query } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";

const getAllServices = async () => {
  const rows = await query(
    "SELECT service_code, service_name, service_icon, service_tariff FROM services"
  );

  if (rows.length === 0) {
    throw new ResponseError(404, "Service not found");
  }

  return {
    status: 0,
    message: "Sukses",
    data: rows,
  };
};

export default { getAllServices };
