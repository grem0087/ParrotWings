
namespace WebApi.Infrastructure
{
    public static class JsonResultHelper
    {
        public static object Error(object data = null) => new { IsSuccess = false, Data = data };
        public static object Success(object data = null) => new { IsSuccess = true, Data = data };        
    }
}