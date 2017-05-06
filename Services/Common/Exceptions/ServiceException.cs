using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Exceptions
{
    [Serializable]
    public class ServiceException : Exception
    {        
        public ServiceExceptionType ServiceExceptionType { get; set; }

        public ServiceException()
        {            
        }

        public ServiceException(ServiceExceptionType exceptionType) : this(ExceptionTypeToString(exceptionType), exceptionType)
        {
            ServiceExceptionType = exceptionType;
        }

        public ServiceException(string message, ServiceExceptionType exceptionType) : base(message) {
            ServiceExceptionType = exceptionType;
        }

        private static string ExceptionTypeToString(ServiceExceptionType exceptionType)
        {
            switch (exceptionType)
            {
                case ServiceExceptionType.UserAlreadyExist:
                    return "User already exist";

                case ServiceExceptionType.NotEnoughtBalance:
                    return "Not enought balance";

                case ServiceExceptionType.EntityNotFound:
                    return "Entity not found";                    

                default:
                    throw new NotSupportedException(); 
            }
        }
    }
}
