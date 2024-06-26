package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

type UserRole string

const (
	Member  UserRole = "Member"
	Manager UserRole = "Manager"
)

type LogUser struct {
	ID        int       `gorm:"autoIncrement;primaryKey" json:"id"`
	Username  string    `gorm:"type:text;unique;not null" json:"username"`
	Role      UserRole  `gorm:"type:text" json:"role"`
	Password  string    `json:"-"`
	CreatedAt time.Time `gorm:"default:current_timestamp;index:idx_created_at,sort:desc" json:"-"`
}

type UserCreateSchema struct {
	Username        string   `json:"username"`
	Role            UserRole `json:"role"`
	Password        string   `json:"password" validate:"required,min=8"`
	ConfirmPassword string   `json:"confirmPassword" validate:"required,min=8"`
}

type User struct {
	ID                        uuid.UUID      `gorm:"type:uuid;default:uuid_generate_v4();primary_key" json:"id"`
	Name                      string         `gorm:"type:text;not null" json:"name"`
	Username                  string         `gorm:"type:text;unique;not null" json:"username"`
	Email                     string         `gorm:"unique;not null" json:"-"`
	Password                  string         `json:"-"`
	ProfilePic                string         `gorm:"default:default.jpg" json:"profilePic"`
	CoverPic                  string         `gorm:"default:default.jpg" json:"coverPic"`
	PhoneNo                   string         `json:"-"`
	Bio                       string         `json:"bio"`
	Title                     string         `json:"title"`
	Tagline                   string         `json:"tagline"`
	Tags                      pq.StringArray `gorm:"type:text[]" json:"tags"`
	Links                     pq.StringArray `gorm:"type:text[]" json:"links"`
	NoFollowing               int            `gorm:"default:0" json:"noFollowing"`
	NoFollowers               int            `gorm:"default:0" json:"noFollowers"`
	TotalNoViews              int            `gorm:"default:0" json:"totalNoViews"`
	Impressions               int            `gorm:"default:0" json:"noImpressions"`
	NoOfProjects              int            `gorm:"default:0" json:"noProjects"`
	NoOfCollaborativeProjects int            `gorm:"default:0" json:"noCollaborativeProjects"`
	Admin                     bool           `gorm:"default:false" json:"-"`
	Verified                  bool           `gorm:"default:false" json:"isVerified"`
	OnboardingCompleted       bool           `gorm:"default:false" json:"isOnboardingComplete"`
	OrganizationStatus        bool           `gorm:"default:false" json:"isOrganization"`
	Active                    bool           `gorm:"default:true" json:"-"`
	CreatedAt                 time.Time      `gorm:"default:current_timestamp;index:idx_created_at,sort:desc" json:"-"`
}
