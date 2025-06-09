namespace TheBeaconCocktails.API.Middleware;

public class AuthenticationHelper
{
    //Basic authentication
    //Method for encryption/encoding
    public static string Encrypt(string username, string password)
    {
        string credentials = $"{username}:{password}";
        byte[] bytes = System.Text.Encoding.UTF8.GetBytes(credentials);
        string encryptedCredentials = Convert.ToBase64String(bytes);
        return $"Basic {encryptedCredentials}";
    }

    //Method decryption/decoding
    public static void Decrypt(string encryptedHeader, out string username, out string password)
    {
        var auth = encryptedHeader.Split(' ')[1];
        var usernameAndPassword = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(auth));
        username = usernameAndPassword.Split(':')[0];
        password = usernameAndPassword.Split(':')[1];
    }
}
