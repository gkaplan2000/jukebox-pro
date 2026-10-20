import express from "express";
const router = express.Router();
export default router;

import {
  createPlaylist,
  getPlaylistById,
  getPlaylists,
} from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { getTracksByPlaylistId } from "#db/queries/tracks";
import requireUser from "#/middleware/requireUser";
import requireBody from "#/middleware/requireBody";

router.use(requireUser);

router.get("/", async (req, res) => {
  const playlists = await getPlaylists(req.user.id);
  res.send(playlists);
});

router.post("/", requireBody(["name", "description"]), async (req, res) => {
  const playlist = await createPlaylist(req.body.name, req.body.description, req.user.id);
  res.status(201).send(playlist);
});

router.param("id", async (req, res, next, id) => {
  const playlist = await getPlaylistById(id);
  if (!playlist) return res.status(404).send("Playlist not found.");

  req.playlist = playlist;
  next();
});

router.get("/:id", (req, res) => {
  if (req.user.id !== req.playlist.owner_id) {
    return res
      .status(403)
      .send("You are not authorized to view this playlist.");
  }
  res.send(req.playlist);
});

router.get("/:id/tracks", async (req, res) => {
  if (req.user.id !== req.playlist.owner_id) {
    return res
      .status(403)
      .send("You are not authorized to view this playlist.");
  }
  const tracks = await getTracksByPlaylistId(req.playlist.id);
  res.status(201).send(tracks);
});

router.post("/:id/tracks", requireBody(["trackId"]), async (req, res) => {
  if (req.user.id !== req.playlist.owner_id) {
    return res
      .status(403)
      .send("You are not authorized to view this playlist.");
  }

  const playlistTrack = await createPlaylistTrack(req.playlist.id, req.body.trackId);
  res.status(201).send(playlistTrack);
});
