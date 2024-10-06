package routers

import (
	"github.com/Pratham-Mishra04/interact-admin-microservice/controllers"
	"github.com/gofiber/fiber/v2"
)

func FeedbackRouter(app *fiber.App) {
	feedbackRoutes := app.Group("/feedbacks")
	feedbackRoutes.Get("/", controllers.GetFeedbacks)
}