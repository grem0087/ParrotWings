using DatabaseLayer.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace DatabaseLayer.Repository
{
    public class CommonRepository<TDbEntity> : ICommonRepository<TDbEntity> where TDbEntity : class, IWithId
    {

        protected PWContext PWContext { get; }

        protected DbSet<TDbEntity> EntitiesSet => PWContext.Set<TDbEntity>();

        public CommonRepository(PWContext pwContext)
        {
            PWContext = pwContext;
        }

        public void Add(TDbEntity dbEntity)
        {
            EntitiesSet.Add(dbEntity);
        }        

        public void Delete(TDbEntity dbEntity)
        {
            EntitiesSet.Remove(dbEntity);
        }
        
        public TDbEntity Create()
        {
            return EntitiesSet.Create();
        }

        public IQueryable<TDbEntity> GetAll()
        {
            return EntitiesSet;
        }

        public TDbEntity FirstOrDefault(Expression<Func<TDbEntity, bool>> filter)
        {
            return Find(filter).FirstOrDefault();
        }
        
        public IQueryable<TDbEntity> Find(Expression<Func<TDbEntity, bool>> filter = null)
        {
            return filter == null ? EntitiesSet : EntitiesSet.Where(filter);
        }
    }
}
