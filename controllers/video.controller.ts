import { Request, Response } from "express";
import * as _ from "lodash";
import videoData from "../DATA/video";

class VideoController {
  public getVideos(req: Request, res: Response): void {
    res.json(videoData);
  }

  public getVideo(req: Request, res: Response): void {
    const video = _.find(videoData, { id: Number(req.params.id) });
    res.json(video);
  }
}

export default new VideoController();
