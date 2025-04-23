using Microsoft.AspNetCore.Mvc;
using TheBeaconCocktails.Model.Repositories;
using TheBeaconCocktails.Model.entities;

namespace TheBeaconCocktails.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    //Controller base
    public class RecipeController : ControllerBase
    {
        private readonly RecipeRepository _repository;

        public RecipeController(RecipeRepository repository)
        {
            _repository = repository;
        }

//GET all
        [HttpGet]
        public ActionResult<List<Recipe>> GetAll()
        {
            var recipes = _repository.GetAll();
            return Ok(recipes);
        }

//GET by ID
        [HttpGet("{id}")]
        public ActionResult<Recipe> GetById(int id)
        {
            var recipe = _repository.GetById(id);
            if (recipe == null)
                return NotFound();

            return Ok(recipe);
        }

//POST        
        [HttpPost]
        public ActionResult Post([FromBody] Recipe recipe){
            if (recipe == null)
            {
                return BadRequest("Recipe info missing");
            } 

            bool status = _repository.InsertRecipe(recipe);
            if (status)
            {
                return Ok();
            }
            return BadRequest();
            //This is an implicit try catch clause
        }
//PUT or update
        [HttpPut("{id}")]
        public ActionResult Put(int id, [FromBody] Recipe recipe)
        {
            if (recipe == null || recipe.Id != id)
                return BadRequest("Recipe ID mismatch or data missing");

            bool status = _repository.UpdateRecipe(recipe);
            return status ? Ok() : NotFound();
        }

//DELETE
        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            bool status = _repository.DeleteRecipe(id);
            return status ? Ok() : NotFound();
        }

        
    }
}
