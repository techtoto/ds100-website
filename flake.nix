{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs =
    { self, nixpkgs }:
    let
      forEachSystem =
        f:
        nixpkgs.lib.genAttrs [
          "x86_64-linux"
          "aarch64-linux"
          "x86_64-darwin"
          "aarch64-darwin"
        ] (system: f nixpkgs.legacyPackages.${system});
    in
    {
      devShells = forEachSystem (pkgs: {
        default = pkgs.mkShellNoCC {
          nativeBuildInputs =
            (with pkgs; [
              nushell
              python3
            ])
            ++ (with pkgs.python3Packages; [
              requests
              beautifulsoup4
            ]);
        };
      });
      formatter = forEachSystem (pkgs: pkgs.nixfmt-rfc-style);
    };
}
