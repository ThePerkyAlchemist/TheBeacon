using Microsoft.AspNetCore.Mvc;
using TheBeaconCocktails.Model.entities;
using TheBeaconCocktails.Model.Repositories;

namespace TheBeaconCocktails.API.Controllers;
//this is a comment for demo purposes
[Route("api/[controller]")]
[ApiController]
public class LiquidIngredientController : ControllerBase
{
    private readonly LiquidIngredientRepository _repository;

    public LiquidIngredientController(LiquidIngredientRepository repository)
    {
        _repository = repository;
    }

    //  Display all
    [HttpGet]
    public ActionResult<List<LiquidIngredient>> GetAll()
    {
        return Ok(_repository.GetAll());
    }

    //  Display by id
    [HttpGet("{id}")]
    public ActionResult<LiquidIngredient> GetById(int id)
    {
        var item = _repository.GetById(id);
        if (item == null) return NotFound();
        return Ok(item);
    }

    //  Add new
    [HttpPost]
    public ActionResult Add([FromBody] LiquidIngredient ingredient)
    {
        if (ingredient == null) return BadRequest();
        var success = _repository.Insert(ingredient);
        if (success) return Ok();
        return BadRequest("Insert failed");
    }

    //  Edit existing
    [HttpPut("{id}")]

    public ActionResult Update(int id, [FromBody] LiquidIngredient ingredient)
    {
        if (ingredient == null) return BadRequest();

        var existing = _repository.GetById(ingredient.Id);
        if (existing == null) return NotFound($"Ingredient with ID {ingredient.Id} not found");

        var success = _repository.Update(ingredient);
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
