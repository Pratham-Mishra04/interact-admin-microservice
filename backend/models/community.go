package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

type Community struct {
	ID                          uuid.UUID                    `gorm:"type:uuid;default:uuid_generate_v4();primary_key" json:"id"`
	Title                       string                       `gorm:"type:text;not null" json:"title"`
	Description                 string                       `gorm:"type:text" json:"description"`
	UserID                      uuid.UUID                    `gorm:"type:uuid;not null" json:"userID"`
	User                        User                         `gorm:"" json:"user"`
	CoverPic                    string                       `gorm:"type:text; default:default.jpg" json:"coverPic"`
	BlurHash                    string                       `gorm:"type:text; default:no-hash" json:"blurHash"`
	Tags                        pq.StringArray               `gorm:"type:text[]" json:"tags"`
	Links                       pq.StringArray               `gorm:"type:text[]" json:"links"`
	Category                    string                       `gorm:"type:text;not null" json:"category"`
	TotalNoViews                int                          `gorm:"default:0" json:"totalNoViews"`
	Impressions                 int                          `gorm:"default:0" json:"noImpressions"`
	NoLikes                     int                          `gorm:"default:0" json:"noLikes"`
	IsOpen                      bool                         `gorm:"default:true" json:"isOpen"`
	Memberships                 []CommunityMembership        `gorm:"foreignKey:CommunityID;constraint:OnDelete:CASCADE" json:"memberships"`
	Posts                       []Post                       `gorm:"foreignKey:CommunityID;constraint:OnDelete:CASCADE" json:"posts"`
	CreatedAt                   time.Time                    `gorm:"default:current_timestamp" json:"createdAt"`
	NumberOfMembers             int16                        `gorm:"default:1" json:"noMembers"`
	Status                      int8                         `gorm:"default:1" json:"status"` //* -1 for closed, 0 for requested only, 1 for open
	Reports                     []Report                     `gorm:"foreignKey:CommunityID;constraint:OnDelete:CASCADE" json:"-"`
	CommunityHistories          []CommunityHistory           `gorm:"foreignKey:CommunityID;constraint:OnDelete:CASCADE" json:"-"`
	CommunityMembershipRequests []CommunityMembershipRequest `gorm:"foreignKey:CommunityID;constraint:OnDelete:CASCADE" json:"-"`
}

type CommunityRole string

const (
	CommunityMember CommunityRole = "Member"
	CommunityAdmin  CommunityRole = "Admin"
)

type CommunityMembership struct {
	ID                 uuid.UUID          `gorm:"type:uuid;default:uuid_generate_v4();primary_key" json:"id"`
	CommunityID        uuid.UUID          `gorm:"type:uuid;not null" json:"communityID"`
	Community          Community          `gorm:"" json:"community"`
	UserID             uuid.UUID          `gorm:"type:uuid;not null" json:"userID"`
	User               User               `gorm:"" json:"user"`
	Role               CommunityRole      `gorm:"type:text" json:"role"`
	CreatedAt          time.Time          `gorm:"default:current_timestamp" json:"createdAt"`
	CommunityHistories []CommunityHistory `gorm:"foreignKey:MembershipID;constraint:OnDelete:CASCADE" json:"-"`
}

type CommunityMembershipRequest struct {
	ID          uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primary_key" json:"id"`
	CommunityID uuid.UUID `gorm:"type:uuid;not null" json:"communityID"`
	UserID      uuid.UUID `gorm:"type:uuid;not null" json:"userID"`
	User        User      `gorm:"" json:"user"`
	Status      int8      `gorm:"default:0" json:"status"` //* -1 for rejected, 0 for submitted, 1 for accepted
	CreatedAt   time.Time `gorm:"default:current_timestamp" json:"createdAt"`
}

type CommunityHistory struct {
	CommunityID     uuid.UUID           `gorm:"type:uuid;not null" json:"-"`
	UserID          uuid.UUID           `gorm:"type:uuid;not null" json:"userID"`
	User            User                `gorm:"" json:"user"`
	Title           bool                `son:"title"`
	CoverPic        bool                `json:"coverPic"`
	Description     bool                `json:"description"`
	Links           bool                `json:"links"`
	Tags            bool                `json:"tags"`
	Category        bool                `json:"category"`
	IsOpen          bool                `json:"isOpen"`
	PrevRole        CommunityRole       `json:"prevRole"`
	NewRole         CommunityRole       `json:"newRole"`
	MembershipID    *uuid.UUID          `json:"membershipID"`
	Membership      CommunityMembership `gorm:"" json:"membership"`
	RemovedMemberID *uuid.UUID          `json:"removedMemberID"`
	RemovedMember   User                `gorm:"foreignKey:RemovedMemberID" json:"removedMember"`
	CreatedAt       time.Time           `gorm:"default:current_timestamp" json:"createdAt"`
}