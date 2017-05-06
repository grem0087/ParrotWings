using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DatabaseLayer.Interfaces
{
    public interface ICommonRepository<TEntity> where TEntity: IWithId
    {
        void Add(TEntity entity);
        void Delete(TEntity entity);
        IQueryable<TEntity> GetAll();        
    }
}
