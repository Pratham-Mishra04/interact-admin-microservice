package models

import (
	"time"

	"github.com/google/uuid"
)

type Chat struct {
	ID              uuid.UUID        `gorm:"type:uuid;default:uuid_generate_v4();primary_key" json:"id"`
	Title           string           `gorm:"type:varchar(50)" json:"title"`
	Description     string           `gorm:"type:text" json:"description"`
	IsGroup         bool             `gorm:"default:false" json:"isGroup"`
	IsAdminOnly     bool             `gorm:"default:false" json:"isAdminOnly"`
	IsAccepted      bool             `gorm:"default:false" json:"isAccepted"` //for personal chats only
	CoverPic        string           `gorm:"type:text;default:default.jpg" json:"coverPic"`
	UserID          uuid.UUID        `gorm:"type:uuid;not null" json:"userID"`
	User            User             `gorm:"" json:"user"`
	OrganizationID  *uuid.UUID       `gorm:"type:uuid" json:"orgID"`
	Organization    Organization     `gorm:"" json:"organization"`
	ProjectID       *uuid.UUID       `gorm:"type:uuid" json:"projectID"`
	Project         Project          `gorm:"" json:"project"`
	CreatedAt       time.Time        `gorm:"default:current_timestamp" json:"createdAt"`
	LatestMessageID *uuid.UUID       `gorm:"type:uuid" json:"latestMessageID"`
	LatestMessage   Message          `gorm:"foreignKey:LatestMessageID;constraint:OnDelete:CASCADE" json:"latestMessage"`
	NumberOfMembers int16            `gorm:"default:1" json:"noMembers"`
	Memberships     []ChatMembership `gorm:"foreignKey:ChatID;constraint:OnDelete:CASCADE" json:"memberships"`
	Invitations     []Invitation     `gorm:"foreignKey:ChatID;constraint:OnDelete:CASCADE" json:"invitations"`
	Messages        []Message        `gorm:"foreignKey:ChatID;constraint:OnDelete:CASCADE" json:"-"`
}

type ChatMembership struct {
	ID                uuid.UUID  `gorm:"type:uuid;default:uuid_generate_v4();primary_key" json:"id"`
	UserID            uuid.UUID  `gorm:"type:uuid;not null" json:"userID"`
	User              User       `gorm:"" json:"user"`
	IsAdmin           bool       `gorm:"default:false" json:"isAdmin"`
	ChatID            uuid.UUID  `gorm:"type:uuid;not null" json:"chatID"`
	Chat              Chat       `gorm:"" json:"-"`
	LastReadMessageID *uuid.UUID `gorm:"type:uuid" json:"lastReadMessageID"`
	LastReadMessage   Message    `gorm:"foreignKey:LastReadMessageID;constraint:OnDelete:SET NULL" json:"lastReadMessage"`
	LastChatReset     time.Time  `gorm:"default:current_timestamp" json:"-"`
	IsBlocked         bool       `gorm:"default:false" json:"isBlocked"`
	CreatedAt         time.Time  `gorm:"default:current_timestamp" json:"createdAt"`
}
