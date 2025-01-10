package routers

import (
	"github.com/Pratham-Mishra04/interact-admin-microservice/controllers"
	"github.com/Pratham-Mishra04/interact-admin-microservice/middlewares"
	"github.com/gofiber/fiber/v2"
)

func SuperuserRouter(app *fiber.App) {
	superuserRoutes := app.Group("/superuser", middlewares.Protect(true))

	superuserRoutes.Post("/posts/specific", middlewares.Protect(true), controllers.AddUserSpecificPosts)
	superuserRoutes.Post("/posts/random", middlewares.Protect(true), controllers.AddUserRandomPosts)
}
