using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Exceptions
{
    public enum ServiceExceptionType
    {
        [Description("User already exist")]
        UserAlreadyExist,

        [Description("Not enought balance")]
        NotEnoughtBalance,

        [Description("Entity not found")]
        EntityNotFound

    }
}
