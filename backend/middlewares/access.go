package middlewares

import (
	"github.com/Pratham-Mishra04/interact-admin-microservice/initializers"
	"github.com/gofiber/fiber/v2"
)

func BlockProd(c *fiber.Ctx) error {
	if initializers.CONFIG.ENV != initializers.DevelopmentEnv {
		return &fiber.Error{Code: 403, Message: "This route is blocked."}
	}
	return c.Next()
}
