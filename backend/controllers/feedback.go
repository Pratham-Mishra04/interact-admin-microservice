package controllers

import (
	"github.com/Pratham-Mishra04/interact-admin-microservice/config"
	"github.com/Pratham-Mishra04/interact-admin-microservice/initializers"
	"github.com/Pratham-Mishra04/interact-admin-microservice/models"
	"github.com/Pratham-Mishra04/interact-admin-microservice/utils"
	"github.com/gofiber/fiber/v2"
)

func GetFeedbacks(c *fiber.Ctx) error {
	paginatedDB := utils.Paginator(c)(initializers.DB)
	searchedDB := utils.Search(c)(paginatedDB)

	var feedbacks []models.Feedback
	if err := searchedDB.
		Order("created_at DESC").
		Find(&feedbacks).Error; err != nil {
		return &fiber.Error{Code: 500, Message: config.DATABASE_ERROR}
	}

	return c.Status(200).JSON(fiber.Map{
		"status":  "success",
		"message": "Logs fetched",
		"feedbacks": feedbacks,
	})
}