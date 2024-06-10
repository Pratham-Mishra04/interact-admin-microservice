package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

type Opening struct {
	ID                   uuid.UUID             `gorm:"type:uuid;default:uuid_generate_v4();primary_key" json:"id"`
	OrganizationID       *uuid.UUID            `gorm:"type:uuid;" json:"organizationID"`
	Organization         Organization          `gorm:"" json:"organization"`
	ProjectID            *uuid.UUID            `gorm:"type:uuid;" json:"projectID"`
	Project              Project               `gorm:"" json:"project"`
	Title                string                `gorm:"type:text;not null" json:"title"`
	Description          string                `gorm:"type:text;not null" json:"description"`
	Tags                 pq.StringArray        `gorm:"type:text[]" json:"tags"`
	Active               bool                  `gorm:"default:true" json:"active"`
	UserID               uuid.UUID             `gorm:"type:uuid;not null" json:"userID"`
	User                 User                  `gorm:"" json:"user"`
	CreatedAt            time.Time             `gorm:"default:current_timestamp" json:"createdAt"`
	NoOfApplications     int16                 `json:"noApplications"`
	Impressions          int                   `gorm:"default:0" json:"noImpressions"`
	IsFlagged   bool           `gorm:"default:false" json:"-"`
}
