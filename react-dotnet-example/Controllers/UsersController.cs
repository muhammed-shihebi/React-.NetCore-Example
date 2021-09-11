using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using react_dotnet_example.Models;
using System.Net.Http;
using System.Threading.Tasks;

namespace react_dotnet_example.Controllers
{
    [ApiController]
    public class UsersController : ControllerBase
    {

        private readonly ILogger<UsersController> _logger;
        private readonly IUserRepository _userRepository;

        /*        static readonly IUserRepository repository = new UserRepository();
        */
        public UsersController(ILogger<UsersController> logger, IUserRepository userRepository)
        {
            _logger = logger;
            _userRepository = userRepository;

        }

        [HttpPost]
        [Route("api/login")]
        [Consumes("application/json")]
        public IActionResult Login(User user)
        {
            User dbUser = _userRepository.GetUser(user.email);

            if (dbUser != null && dbUser.password == user.password)
            {
                _logger.LogInformation("User info were given correctly");
                return Ok(dbUser);
            }
            else
            {
                if (dbUser == null)
                {
                    _logger.LogInformation("no user with such email");
                }

                else
                {
                    _logger.LogInformation("password is not correct");
                }
                return NotFound();
            }
        }

        [HttpPost]
        [Route("api/register")]
        [Consumes("application/json")]
        public IActionResult Register(User newUser)
        {
            var resutls = _userRepository.GetUser(newUser.email);

            if (resutls == null)
            {
                _logger.LogInformation("There is no user in the database with this email"); 
                User user = _userRepository.Add(newUser);

                return Ok(user);
            }
            else
            {
                _logger.LogInformation("There is a user with this email");
                return NotFound();
            }
        }

        [HttpPost]
        [Route("api/update")]
        [Consumes("application/json")]
        public IActionResult UpdateUser(UserChanges userChanges)
        {
            User dbUser = _userRepository.GetUser(userChanges.oldUser.email);
            if (dbUser != null && dbUser.password == userChanges.oldUser.password)
            {
                _userRepository.Delete(userChanges.oldUser.email);
                User newAddUser = _userRepository.Add(userChanges.newUser);
                return Ok(newAddUser);
            }
            else
            {
                return NotFound();
            }
        }


        // =========================================================== 
    }
}
