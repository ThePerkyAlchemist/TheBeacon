using Microsoft.AspNetCore.Mvc;
using TheBeaconCocktails.Model.entities;
using TheBeaconCocktails.Model.Repositories;

namespace TheBeaconCocktails.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class RecipeController : ControllerBase
{
    private readonly RecipeRepository _repository;

    public RecipeController(RecipeRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public ActionResult<List<Recipe>> GetAll() => Ok(_repository.GetAll());

    [HttpGet("{id}")]
    public ActionResult<Recipe> GetById(int id)
    {
        var item = _repository.GetById(id);
        return item == null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public ActionResult Add([FromBody] Recipe item)
    {
        if (item == null) return BadRequest();
        return _repository.Insert(item) ? Ok() : BadRequest("Insert failed");
    }

    [HttpPut("{id}")]
    public ActionResult Update(int id, [FromBody] Recipe item)
    {
        if (item == null) return BadRequest();
        var existing = _repository.GetById(id);
        if (existing == null) return NotFound($"Recipe with ID {id} not found");
        return _repository.Update(item) ? Ok() : BadRequest("Update failed");
    }

    [HttpDelete("{id}")]
    public ActionResult Delete(int id)
    {
        var existing = _repository.GetById(id);
        if (existing == null) return NotFound();
        return _repository.Delete(id) ? NoContent() : BadRequest("Delete failed");
    }
}
