using Microsoft.AspNetCore.Mvc;
using TheBeaconCocktails.Model.entities;
using TheBeaconCocktails.Model.Repositories;

namespace TheBeaconCocktails.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DrinkProfileController : ControllerBase
{
    private readonly DrinkProfileRepository _repository;

    public DrinkProfileController(DrinkProfileRepository repository)
    {
        _repository = repository;
    }

    // Display all
    [HttpGet]
    public ActionResult<List<DrinkProfile>> GetAll()
    {
        return Ok(_repository.GetAll());
    }

    // Display by id
    [HttpGet("{id}")]
    public ActionResult<DrinkProfile> GetById(int id)
    {
        var item = _repository.GetById(id);
        if (item == null) return NotFound();
        return Ok(item);
    }

    // Add new
    [HttpPost]
    public ActionResult Add([FromBody] DrinkProfile profile)
    {
        if (profile == null) return BadRequest();
        var success = _repository.Insert(profile);
        if (success) return Ok();
        return BadRequest("Insert failed");
    }

    // Edit existing
    [HttpPut("{id}")]
    public ActionResult Update(int id, [FromBody] DrinkProfile profile)
    {
        if (profile == null) return BadRequest();

        var existing = _repository.GetById(profile.Id);
        if (existing == null) return NotFound($"DrinkProfile with ID {profile.Id} not found");

        var success = _repository.Update(profile);
        if (success) return Ok();
        return BadRequest("Update failed");
    }

    // Remove by id
    [HttpDelete("{id}")]
    public ActionResult Delete(int id)
    {
        var existing = _repository.GetById(id);
        if (existing == null) return NotFound();

        var success = _repository.Delete(id);
        if (success) return NoContent();
        return BadRequest("Delete failed");
    }
}