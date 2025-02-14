package cache

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/Pratham-Mishra04/interact-admin-microservice/helpers"
	"github.com/Pratham-Mishra04/interact-admin-microservice/initializers"
	"github.com/redis/go-redis/v9"
)

var ctx = context.TODO()

func GetFromCache(key string) (string, error) {
	if initializers.RedisClient == nil {
		return "", fmt.Errorf("redis client not found")
	}

	data, err := initializers.RedisClient.Get(ctx, key).Result()
	if err != nil {
		if err == redis.Nil {
			return "", fmt.Errorf("item not found in cache")
		}
		go helpers.LogServerError("Error Getting from cache", err, "redis")
		return "", fmt.Errorf("error getting from cache")
	}
	return data, nil
}

func GetAllMatchingKeysWithTTL(pattern string) (map[string]struct {
	Value string
	TTL   time.Duration
}, error) {
	if initializers.RedisClient == nil {
		return nil, fmt.Errorf("redis client not found")
	}

	iter := initializers.RedisClient.Scan(ctx, 0, pattern, 0).Iterator()
	results := make(map[string]struct {
		Value string
		TTL   time.Duration
	})

	for iter.Next(ctx) {
		key := iter.Val()

		value, err := initializers.RedisClient.Get(ctx, key).Result()
		if err != nil {
			if err == redis.Nil {
				continue // Key doesn't exist, move to next
			}
			helpers.LogServerError(fmt.Sprintf("Error getting value for key %s", key), err, "redis")
			continue
		}

		// Get TTL
		ttl, err := initializers.RedisClient.TTL(ctx, key).Result()
		if err != nil {
			helpers.LogServerError(fmt.Sprintf("Error getting TTL for key %s", key), err, "redis")
			continue
		}

		// Store value and TTL
		results[key] = struct {
			Value string
			TTL   time.Duration
		}{
			Value: value,
			TTL:   ttl,
		}
	}

	if err := iter.Err(); err != nil {
		return nil, fmt.Errorf("error scanning redis keys: %w", err)
	}

	return results, nil
}

func SetToCache(key string, data []byte) error {
	if initializers.RedisClient == nil {
		return fmt.Errorf("redis client not found")
	}

	if err := initializers.RedisClient.Set(ctx, key, data, initializers.CacheExpirationTime).Err(); err != nil {
		go helpers.LogServerError("Error Setting to cache", err, "redis")
		return fmt.Errorf("error setting to cache")
	}
	return nil
}

func SetToCacheWithCustomTTL(key string, model interface{}, TTL time.Duration) error {
	data, err := json.Marshal(model)
	if err != nil {
		return fmt.Errorf("error while marshaling %s: %w", key, err)
	}

	if initializers.RedisClient == nil {
		return fmt.Errorf("redis client not found")
	}

	if err := initializers.RedisClient.Set(ctx, key, data, TTL).Err(); err != nil {
		go helpers.LogServerError("Error Setting to cache", err, "redis")
		return fmt.Errorf("error setting to cache")
	}

	return nil
}

func RemoveFromCache(key string) error {
	if initializers.RedisClient == nil {
		return fmt.Errorf("redis client not found")
	}

	err := initializers.RedisClient.Del(ctx, key).Err()
	if err != nil {
		if err == redis.Nil {
			return nil
		}
		go helpers.LogServerError("Error Removing from cache", err, "redis")
		return fmt.Errorf("error removing from cache")
	}
	return nil
}
