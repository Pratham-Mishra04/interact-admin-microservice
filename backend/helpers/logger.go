package helpers

import (
	"fmt"
	"strings"

	"github.com/Pratham-Mishra04/interact-admin-microservice/config"
	"github.com/Pratham-Mishra04/interact-admin-microservice/initializers"
	"github.com/Pratham-Mishra04/interact-admin-microservice/models"
	"github.com/gofiber/fiber/v2"
)

func LogServerError(title string, err error, path string) {
	if err == nil {
		err = fmt.Errorf("no error message provided")
	}

	var log models.Log

	log.Level = "error"
	log.Title = title
	log.Description = err.Error()
	log.Path = path
	log.Resource = "admin_backend"

	result := initializers.DB.Create(&log)
	if result.Error != nil {
		config.Logger.Errorw("Error while adding a log", "Error:", result.Error)
	}
}

func LogUnAuthorizedAccess(c *fiber.Ctx, err error) {
	if err == nil {
		err = fmt.Errorf("no access error, request was blocked")
	}

	method := c.Method()
	url := c.OriginalURL()
	apiToken := c.Get("api-token", "Not Provided")
	origin := c.Get("Origin", "Not Provided")
	clientIP := getClientIP(c)
	proxyChain := c.Get("X-Forwarded-For", "Not Provided")
	headers := c.GetReqHeaders()
	errorDescription := err.Error()

	logDescription := fmt.Sprintf(
		"Unauthorized Access Attempt\nMethod: %s\nURL: %s\nOrigin: %s\nClient IP: %s\nProxy Chain: %v\nAPI-Token: %s\nHeaders: %v\nError: %s",
		method, url, origin, clientIP, proxyChain, apiToken, headers, errorDescription,
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

func getClientIP(c *fiber.Ctx) string {
	if ip := c.Get("X-Forwarded-For"); ip != "" {
		ips := strings.Split(ip, ",")
		return strings.TrimSpace(ips[0])
	}
	if ip := c.Get("X-Real-IP"); ip != "" {
		return ip
	}
	return c.IP()
}
