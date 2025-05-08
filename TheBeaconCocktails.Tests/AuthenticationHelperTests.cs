using Microsoft.VisualStudio.TestTools.UnitTesting;
using TheBeaconCocktails.API.Middleware;

namespace TheBeaconCocktails.Tests;

[TestClass]
public class AuthenticationHelperTests
{
    [TestMethod]
    public void EncryptTest()
    {
        string username = "john.doe";
        string password = "VerySecret!";
        var result = AuthenticationHelper.Encrypt(username, password);
        Assert.AreEqual("Basic am9obi5kb2U6VmVyeVNlY3JldCE=", result);
    }

    [TestMethod]
    public void DecryptTest()
    {
        string header = "Basic am9obi5kb2U6VmVyeVNlY3JldCE=";
        AuthenticationHelper.Decrypt(header, out string username, out string password);
        Assert.AreEqual("john.doe", username);
        Assert.AreEqual("VerySecret!", password);
    }
}
