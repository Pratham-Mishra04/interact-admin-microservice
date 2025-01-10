package routers

import (
	"github.com/Pratham-Mishra04/interact-admin-microservice/controllers"
	"github.com/Pratham-Mishra04/interact-admin-microservice/middlewares"
	"github.com/gofiber/fiber/v2"
)

func LogRouter(app *fiber.App) {
	app.Post("/logger/api", middlewares.APIProtect, controllers.AddLog)

	logRoutes := app.Group("/logger")
	logRoutes.Get("/", middlewares.Protect(false), controllers.GetLogs)
	logRoutes.Get("/filter_data", middlewares.Protect(false), controllers.GetFilterData)

	logRoutes.Post("/", middlewares.Protect(true), controllers.AddLog)
	logRoutes.Delete("/:logID", middlewares.Protect(true), controllers.DeleteLog)
}
