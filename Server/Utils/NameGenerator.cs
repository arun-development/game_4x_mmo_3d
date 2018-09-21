// PVS-Studio Static Code Analyzer for C, C++ and C#: http://www.viva64.com

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Server.Utils
{
    public class NameGenerator
    {
        [MaxLength(26)]
        private static readonly List<string> Letters = new List<string>
        {
            "A",
            "B",
            "C",
            "D",
            "E",
            "F",
            "G",
            "H",
            "I",
            "J",
            "K",
            "L",
            "M",
            "N",
            "O",
            "P",
            "Q",
            "R",
            "S",
            "T",
            "U",
            "V",
            "W",
            "X",
            "Y",
            "Z"
        };
        [MaxLength(10)]
        private static readonly List<string> Numbers = new List<string>
        {
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9"
        };

        private static readonly int LetterCount = Letters.Count;
        private static readonly int NumberCount = Numbers.Count;

        private readonly Random _rand = new Random();

        public List<string> GenerateStarNames()
        {
            var result = new List<string>();
            const string separator = "-";
            //const int countLeft = 2;
            var totalSimbols = LetterCount + NumberCount;
            //var countResult = (Math.Pow(totalSimbols, 3)* LetterCount)-totalSimbols;
            var countResult = 100000;

            var i = 0;

            while (i < countResult)
            {
                var firstLetter = Letters[_rand.Next(0, Letters.Count)];
                var secondLetter = GetSimbol();
                var thridLetter = GetSimbol(secondLetter);
                var fourthLetter = GetSimbol(thridLetter);

                var name = firstLetter + secondLetter + separator + thridLetter + fourthLetter;

                if (!result.Contains(name))
                {
                    result.Add(name);
                    i++;
                }
            }


            return result;
        }

        private string GetSimbol(string prevSimbol = null)
        {
            var simbol = "";

            var chance = NumberCount/(double) LetterCount;

            if (_rand.NextDouble() > chance)
            {
                simbol = Letters[_rand.Next(0, LetterCount)];
            }
            else
            {
                simbol = Numbers[_rand.Next(0, NumberCount)];
            }

            if (prevSimbol != null && simbol == prevSimbol)
            {
                simbol = GetSimbol(simbol);
            }

            return simbol;
        }
    }
}