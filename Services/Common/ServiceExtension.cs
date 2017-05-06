using DatabaseLayer.Interfaces;
using Services.Exceptions;
using System.Linq;

namespace Services.Common
{
    public static class ServiceExtension
    {

        public static T GetById<T>(this ICommonRepository<T> repository, int Id) where T : IWithId
        {
            var result = repository.GetAll().FirstOrDefault(x => x.Id == Id);
            if (result == null)
            {
                throw new ServiceException(ServiceExceptionType.EntityNotFound);
            }
            return result;
        }
    }
}
