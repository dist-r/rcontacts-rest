# ==============
#  Builder Image
# ==============
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY aspdotnet.csproj ./
RUN dotnet restore

COPY . ./
RUN dotnet publish aspdotnet.csproj -c Release -o /app/publish /p:UseAppHost=false

# ==============
#  Final Image
# ==============
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS production
WORKDIR /app

COPY --from=build /app/publish ./

ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:3000

EXPOSE 3000
ENTRYPOINT ["dotnet", "aspdotnet.dll"]
