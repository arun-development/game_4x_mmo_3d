using Server.Core.Images;

namespace Server.Core.Interfaces.ImageService
{
    public interface IAvatar: IImageUrls
    {
        UserImageModel GetDefaultUrls();
    }
}
