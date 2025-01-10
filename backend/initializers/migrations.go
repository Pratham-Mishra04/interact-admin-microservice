package initializers

import (
	"fmt"

	"github.com/Pratham-Mishra04/interact-admin-microservice/models"
)

func AutoMigrate() {
	fmt.Println("\nStarting Migrations...")
	DB.AutoMigrate(
		&models.Log{},
	)
	fmt.Println("Migrations Finished!")
}
