using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DatabaseLayer.Interfaces
{
    public interface IRepositoryManager
    {
        ICommonRepository<TDbEntity> GetCommonRepository<TDbEntity>() where TDbEntity : class, IWithId;
        void SaveChanges();        
    }
}
