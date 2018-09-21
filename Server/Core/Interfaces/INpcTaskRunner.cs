namespace Server.Core.Interfaces
{
    public interface INpcTaskRunner
    {
        void Run();
        void Stop();
        bool Stoped { get; }
        void RemovePlanetFromActivatedPlanets(int planetId);
    }
}