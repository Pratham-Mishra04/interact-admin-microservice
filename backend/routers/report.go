package routers

import (
	"github.com/Pratham-Mishra04/interact-admin-microservice/controllers"
	"github.com/gofiber/fiber/v2"
)

func ReportRouter(app *fiber.App) {
	reportRoutes := app.Group("/reports")
	reportRoutes.Get("/", controllers.GetReports)
}