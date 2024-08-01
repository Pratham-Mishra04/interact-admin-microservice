package helpers

import (
	"fmt"

	"github.com/Pratham-Mishra04/interact-admin-microservice/config"
	"github.com/Pratham-Mishra04/interact-admin-microservice/initializers"
	"github.com/Pratham-Mishra04/interact-admin-microservice/models"
	"github.com/gofiber/fiber/v2"
)

func LogUnAuthorizedAccess(c *fiber.Ctx) {
	method := c.Method()
	url := c.OriginalURL()
	apiToken := c.Get("api-token", "Not Provided")
	origin := c.Get("Origin", "Not Provided")
	clientIP := c.IP()

	logDescription := fmt.Sprintf(
		"Unauthorized Access Attempt\nMethod: %s\nURL: %s\nOrigin: %s\nClient IP: %s\nAPI-Token: %s",
		method, url, origin, clientIP, apiToken,
	)

	var log models.Log

	log.Level = "warn"
	log.Title = "UnAuthorized Access Attempt"
	log.Description = logDescription
	log.Path = "admin_backend"
	log.Resource = "admin_backend"

	result := initializers.DB.Create(&log)
	if result.Error != nil {
		config.Logger.Errorw("Error while adding a log", "Error:", result.Error)
	}
}
