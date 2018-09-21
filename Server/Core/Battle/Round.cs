namespace Server.Core.Battle
{
    public class Round
    {

        public int RoundCount = 0;
        public BattleSides Before;
        public BattleSides Lost;
        public BattleSides After;
        public bool InitiativeIsAtacker;
        public BattleResult BattleResult;
    }
}
