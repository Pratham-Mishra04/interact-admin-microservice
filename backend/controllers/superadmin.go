package controllers

import (
	"bytes"
	"fmt"
	"io"
	"math/rand"
	"mime/multipart"
	"net/http"

	"github.com/Pratham-Mishra04/interact-admin-microservice/config"
	"github.com/Pratham-Mishra04/interact-admin-microservice/helpers"
	"github.com/Pratham-Mishra04/interact-admin-microservice/initializers"
	"github.com/Pratham-Mishra04/interact-admin-microservice/models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func AddUserSpecificPosts(c *fiber.Ctx) error {
	var reqBody struct {
		Usernames []string `json:"users"`
		Captions  []string `json:"captions"`
	}

	if err := c.BodyParser(&reqBody); err != nil {
		return &fiber.Error{Code: 400, Message: "Invalid Req Body"}
	}

	if len(reqBody.Captions) != len(reqBody.Usernames) {
		return &fiber.Error{Code: 400, Message: "Number of captions and usernames do not match"}
	}

	var posts []models.Post

	for i, username := range reqBody.Usernames {
		var user models.User
		if err := initializers.DB.Where("username = ?", username).First(&user).Error; err != nil {
			return helpers.AppError{Code: 500, Message: config.DATABASE_ERROR, LogMessage: err.Error(), Err: err}
		}

		post := models.Post{
			UserID:  user.ID,
			Content: reqBody.Captions[i],
		}

		if err := initializers.DB.Create(&post).Error; err != nil {
			return helpers.AppError{Code: 500, Message: config.DATABASE_ERROR, LogMessage: err.Error(), Err: err}
		}

		SendUploadImageReq(c, &post)

		if err := initializers.DB.
			Preload("User").
			Preload("RePost").
			Preload("RePost.User").
			Preload("TaggedUsers").
			First(&post).Error; err != nil {
			return helpers.AppError{Code: 500, Message: config.DATABASE_ERROR, LogMessage: err.Error(), Err: err}
		}
		posts = append(posts, post)
	}

	return c.Status(201).JSON(fiber.Map{
		"status":  "success",
		"message": "Post Added",
		"posts":   posts,
	})
}

func AddUserRandomPosts(c *fiber.Ctx) error {
	var reqBody struct {
		Usernames []string `json:"users"`
		Captions  []string `json:"captions"`
	}

	if err := c.BodyParser(&reqBody); err != nil {
		return &fiber.Error{Code: 400, Message: "Invalid Req Body"}
	}

	var users []models.User

	for _, username := range reqBody.Usernames {
		var user models.User
		if err := initializers.DB.Where("username = ?", username).First(&user).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				continue
			}
			return helpers.AppError{Code: 500, Message: config.DATABASE_ERROR, LogMessage: err.Error(), Err: err}
		}

		users = append(users, user)
	}

	if len(users) == 0 {
		return &fiber.Error{Code: 400, Message: "No User found with the given usernames"}
	}

	var posts []models.Post

	for _, caption := range reqBody.Captions {
		post := models.Post{
			UserID:  users[rand.Intn(len(users))].ID,
			Content: caption,
		}

		if err := initializers.DB.Create(&post).Error; err != nil {
			return helpers.AppError{Code: 500, Message: config.DATABASE_ERROR, LogMessage: err.Error(), Err: err}
		}

		SendUploadImageReq(c, &post)

		if err := initializers.DB.
			Preload("User").
			Preload("RePost").
			Preload("RePost.User").
			Preload("TaggedUsers").
			First(&post).Error; err != nil {
			return helpers.AppError{Code: 500, Message: config.DATABASE_ERROR, LogMessage: err.Error(), Err: err}
		}
		posts = append(posts, post)
	}

	return c.Status(201).JSON(fiber.Map{
		"status":  "success",
		"message": "Post Added",
		"posts":   posts,
	})
}

func SendUploadImageReq(c *fiber.Ctx, post *models.Post) {
	url := initializers.CONFIG.BACKEND_URL + "/misc/uploadPostImages"

	var requestBody bytes.Buffer
	writer := multipart.NewWriter(&requestBody)

	_ = writer.WriteField("postID", post.ID.String())

	form, err := c.MultipartForm()
	if err != nil {
		return
	}

	files := form.File["images"]
	if len(files) == 0 {
		return
	}

	for _, file := range files {
		filePart, err := writer.CreateFormFile("images", file.Filename)
		if err != nil {
			return
		}

		src, err := file.Open()
		if err != nil {
			return
		}
		defer src.Close()

		_, err = io.Copy(filePart, src)
		if err != nil {
			return
		}
	}

	writer.Close()

	req, err := http.NewRequest("POST", url, &requestBody)
	if err != nil {
		return
	}

	req.Header.Set("Content-Type", writer.FormDataContentType())

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error sending request:", err)
		return
	}
	defer resp.Body.Close()
}
