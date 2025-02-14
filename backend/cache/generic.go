package cache

import (
	"encoding/json"
	"errors"
	"fmt"

	"github.com/Pratham-Mishra04/interact-admin-microservice/config"
	"github.com/Pratham-Mishra04/interact-admin-microservice/helpers"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func GetFromCacheGeneric(key string, model interface{}) error {
	data, err := GetFromCache(key)
	if err != nil {
		return err
	}

	if err := json.Unmarshal([]byte(data), model); err != nil {
		return fmt.Errorf("error while unmarshaling %s: %w", key, err)
	}

	return nil
}

func SetToCacheGeneric(key string, model interface{}) error {
	data, err := json.Marshal(model)
	if err != nil {
		return fmt.Errorf("error while marshaling %s: %w", key, err)
	}

	if err := SetToCache(key, data); err != nil {
		return err
	}

	return nil
}

func GetFromCacheOrDB[T any](key string, item *T, query func() error) error {
	if err := GetFromCacheGeneric(key, item); err == nil {
		return nil
	}

	if err := query(); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return &fiber.Error{Code: 400, Message: "No item found."}
		}
		return helpers.AppError{
			Code:       500,
			Message:    config.DATABASE_ERROR,
			LogMessage: err.Error(),
			Err:        err,
		}
	}

	go SetToCacheGeneric(key, item)

	return nil
}
