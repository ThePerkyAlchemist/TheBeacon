using System;
using System.Text.Json.Serialization;
namespace TheBeaconCocktails.API.Model;
public class Login {
[JsonPropertyName("username")]
public string Username { get; set; }
[JsonPropertyName("password")]
public string Password { get; set; }
}