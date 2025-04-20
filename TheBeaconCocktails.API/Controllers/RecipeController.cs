using Microsoft.AspNetCore.Mvc;
using TheBeaconCocktails.Model.Repositories;
using TheBeaconCocktails.Model.entities;

namespace TheBeaconCocktails.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecipeController : ControllerBase
    {
        private readonly RecipeRepository _repository;

        public RecipeController(RecipeRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public ActionResult<List<Recipe>> GetAll()
        {
            var recipes = _repository.GetAll();
            return Ok(recipes);
        }
    }
}
