package routers

import (
	"github.com/Pratham-Mishra04/interact-admin-microservice/controllers"
	"github.com/Pratham-Mishra04/interact-admin-microservice/middlewares"
	"github.com/gofiber/fiber/v2"
)

func SuperuserRouter(app *fiber.App) {
	superuserRoutes := app.Group("/superuser", middlewares.Protect(true))

	superuserRoutes.Get("/approval-code", controllers.GetOrgApprovalCodes)
	superuserRoutes.Post("/approval-code", controllers.CreateOrgApprovalCode)
	superuserRoutes.Delete("/approval-code/:email", controllers.RemoveOrgApprovalCode)

	superuserRoutes.Post("/posts/specific", controllers.AddUserSpecificPosts)
	superuserRoutes.Post("/posts/random", controllers.AddUserRandomPosts)
}
