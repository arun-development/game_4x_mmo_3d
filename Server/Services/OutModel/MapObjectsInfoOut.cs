using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Server.Core.Images;
using Server.Core.Infrastructure.ComplexButton;
using Server.Core.Interfaces.ForModel;
using Server.Core.Map;
using Server.Core.Map.Structure;
using Server.Core.СompexPrimitive;
using Server.Services.HtmlHelpers;

namespace Server.Services.OutModel
{
    public abstract class MapObjectsInfoOut : MapItemGeometry, IPlanshetItem, IComplexButtonView
    {
        public int SystemId;

        [MaxLength(14)]
        public string SectorName { get; set; }

        [MaxLength(14)]
        public string GalaxyName { get; set; }

        [MaxLength(14)]
        public string SystemName { get; set; }

        public string Description;
        public bool IsBookmark;

        public string TranslateName;
        public int BookmarkId;

        public string TypeNativeName;
        public string TypeTranslateName;
        public string SubtypeNativeName;
        public string SubtypeTranslateName;

        [MaxLength(14)]
        public string Owner { get; set; }

        [MaxLength(14)]
        public string AllianceName { get; set; }

        public SpriteImages SpriteImages;
        public short ChildCount;
        public Vector3 Coord;

        public ComplexButtonView ComplexButtonView { get; set; }


        public void SetComplexButtonView()
        {
            var cb = new ComplexButtonView();
            cb.Full(_complexBtnInit());
            ComplexButtonView = cb;
        }

        public List<IButtonsView> Buttons { get; set; }
        public bool HasButtons { get; set; }

        private SectionContentViewData _complexBtnInit()
        {
            MapTypes type;
            Enum.TryParse(TypeNativeName, true, out type);
            var name = NativeName;
 
            var bokmarkJumpAction = $"GameServices.bookmarkService.bookmarkJump({GalaxyId},{SectorId},{SystemId},{Id},{TextureTypeId},'{TypeNativeName}')";

            var infoIcon = SpriteImages.Icon;
            var jumpIcon = SpriteImages.Icon;

            //Planet
            if (type == MapTypes.Planet)
            {
                infoIcon = new SpriteImages().MapControlIcons("planetinfo").Icon;
                jumpIcon = new SpriteImages().MapControlIcons("jumptoplanetoid").Icon;
            }
            //Star
            else if (type == MapTypes.Star)
            {
                infoIcon = new SpriteImages().MapControlIcons("starinfo").Icon;
                jumpIcon = new SpriteImages().MapControlIcons("jumptostar").Icon;
            }
            //Sector
            else if (type == MapTypes.Sector)
            {
                infoIcon = new SpriteImages().MapControlIcons("sectorinfo").Icon;
                jumpIcon = new SpriteImages().MapControlIcons("jumpinsector").Icon;
            }
            //Galaxy
            else if (type == MapTypes.Sector)
            {
                infoIcon = new SpriteImages().MapControlIcons("galaxyinfo").Icon;
                jumpIcon = "";
                bokmarkJumpAction = "";
            }


            return new SectionContentViewData
            {
                Left = new SectionItem
                {
                    //todo tmp imgCss
                    // Data = ImageView.Img(SpriteImages.Icon, Name),
                    
                    Data = ImageView.Img(infoIcon, NativeName)
                },
                Centr = new SectionItem
                {
                    Data = new {Head = name},
                    //Path = SimpleBtnCentr.SimpleBtnCentrViewPath,
                    ItemId = GameHtmlAtributes.Action
                },
                Right = new SectionItem
                {
                    //todo tmp imgCss
                    Data = ImageView.Img(jumpIcon, "delete after Go to..."),
                    ItemId = GameHtmlAtributes.Jump,
                    JsFunction = bokmarkJumpAction
                }
            };
        }
    }

    public class MoonInfoOut : MapObjectsInfoOut
    {
        public object Statistic { get; set; }

        public override string MapType()
        {
            return PlanetoidSubTypes.Moon.ToString();
        }
    }

    public class PlanetInfoOut : MapObjectsInfoOut
    {
        public object Statistic { get; set; }
        public DateTime LastActive { get; set; }
        public bool PlanetReferToCurrentUser { get; set; }


        public void PlanetInfoButtons()
        {
            if (HasButtons)
            {
                return;
            }
            HasButtons = true;
     
            if (PlanetReferToCurrentUser)
            {
                if (IsBookmark)
                {
                    Buttons = new List<IButtonsView>
                    {
                        ButtonsView.DeleteBookmark(1, BookmarkId, TypeNativeName, Id, 0)
                    };
                }
                else
                {
                    Buttons = new List<IButtonsView>
                    {
                        ButtonsView.ConstructorSizeBtn(1, true, "Go To Planet",
                            "GameServices.mapControlHelper.jumpToUserPlanet", new {OwnId = Id, UpdateSelect = true})
                    };
                }
            }
            else if (IsBookmark)
            {
                Buttons = new List<IButtonsView>
                {
                    ButtonsView.Spy(3, Id, NativeName, false),
                    ButtonsView.Attack(false, 3, NativeName,Id),
                    ButtonsView.DeleteBookmark(3, BookmarkId, TypeNativeName, Id, 0)
                };
            }
            else
            {
                Buttons = new List<IButtonsView>
                {
                    ButtonsView.Spy(2, Id, NativeName, false),
                    ButtonsView.Attack(false, 2, NativeName,Id)
                };
            }
        }

        public override string MapType()
        {
            return MapTypes.Planet.ToString();
        }
    }


    public class StarInfoOut : MapObjectsInfoOut
    {
        public double Bonus { get; set; }
        public object Statistic { get; set; }

        public void StarInfoButtons()
        {
            HasButtons = IsBookmark;
            if (IsBookmark)
            {
                Buttons = new List<IButtonsView>
                {
                    ButtonsView.DeleteBookmark(1, BookmarkId, TypeNativeName, Id, 1)
                };
            }
        }

        public override string MapType()
        {
            return MapTypes.Star.ToString();
        }
    }

    public class SectorInfoOut : MapObjectsInfoOut
    {
        public void SectorInfoButtons()
        {
            HasButtons = IsBookmark;
            if (IsBookmark)
            {
                Buttons = new List<IButtonsView>
                {
                    ButtonsView.DeleteBookmark(1, BookmarkId, TypeNativeName, Id, 2)
                };
            }
        }

        public override string MapType()
        {
            return MapTypes.Sector.ToString();
        }
    }

    public class GalaxyInfoOut : MapObjectsInfoOut
    {
        public override string MapType()
        {
            return MapTypes.Galaxy.ToString();
        }
    }
}