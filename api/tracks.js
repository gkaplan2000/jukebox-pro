import express from "express";
const router = express.Router();
export default router;

import { getTracks, getTrackById } from "#db/queries/tracks";
import requireUser from "#middleware/requireUser";
import {getPlaylistsWithTrackWithOwner} from "#db/queries/playlists";

router.get("/", requireUser, async (req, res) => {
  const tracks = await getTracks();
  res.send(tracks);
});

router.param("id", async (req, res, next, id) => {
  const track = await getTrackById(req.params.id);
  if (!track) return res.status(404).send("Track not found.");

  req.track = track;
  next();
});

router.get("/:id", async (req, res) => {
  res.send(req.track);
});

router.get("/:id/playlists", requireUser, async (req, res) => {
  const playlists = await getPlaylistsWithTrackWithOwner(req.track.id, req.user.id);
  res.send(playlists);
});