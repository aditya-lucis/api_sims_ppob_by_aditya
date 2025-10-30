import userService from "../service/user-service.js"

const register = async (req, res, next) => {
    try {
        const result = await userService.register(req.body)
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const login = async (req, res, next) => {
    try {
        const result = await userService.login(req.body)
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const get = async (req, res, next) => {
  try {
    const result = await userService.get(req.user.id)
    
    res.status(200).json({
      status: 0,
      message: "Sukses",
      data: {
        email: result.email,
        first_name: result.first_name,
        last_name: result.last_name,
      },
    })
  } catch (e) {
    next(e)
  }
}

const update = async (req, res, next) => {
  try {
    const request = req.body
    request.id = req.user.id

    const result = await userService.update(request)

    res.status(200).json({
      status: 0,
      message: "Sukses",
      data: result.data,
    })
  } catch (e) {
    next(e)
  }
}

const logout = async (req, res, next) => {
  try {
    const result = await userService.logout()
    res.status(200).json({
      status: 0,
      message: result.message,
      data: null,
    })
  } catch (e) {
    next(e)
  }
}

const updateProfileImage = async (req, res, next) => {
  try {
    const result = await userService.uploadProfileImage(req.user.id, req.file)
    res.status(200).json(result)
  } catch (e) {
    if (e.message === "Format Image tidak sesuai") {
      return res.status(400).json({
        status: 102,
        message: "Format Image tidak sesuai",
        data: null,
      })
    }
    next(e)
  }
}


export default {
    register,login, get, update,logout,updateProfileImage
}